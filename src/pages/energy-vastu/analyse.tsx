import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasAreaHandle } from "@/src/types/vastuTypes";
import CanvasToolbar from "@/src/components/CanvasToolBar";
import CanvasArea, { Pin } from "@/src/components/CanvasAreas";
import { useParams } from "react-router-dom";
import { getVastuAnalysisByID } from "@/src/services/energyVastu/VastuAPIFunctions";
import CustomLoader from "@/src/components/CustomLoader";

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex gap-1">
    <span className="text-sm font-semibold text-black whitespace-nowrap">
      {label} :
    </span>
    <span className="text-sm font-normal text-black/90">{value ?? ""}</span>
  </div>
);

const EnergyVastuAnalyse = () => {
  const [tool, setTool] = useState<"move" | "pin" | "tool">("move");
  const [division, setDiv] = useState(8);
  const [degree, setDegree] = useState(0);
  const [gateOptions, setGateOptions] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<CanvasAreaHandle>(null);

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getVastuAnalysisByID(Number(id));
        console.log("user's data:: ", res.data);
        setUserDetails(res.data);
      } catch (error) {
        console.error("Failed to fetch analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const details = userDetails
    ? [
      { label: "Full Name", value: userDetails.full_name },
      { label: "Mobile No.", value: userDetails.mobile_number },
      { label: "Category", value: userDetails.category },
      {
        label: "Date of Purchase",
        value: userDetails.date_of_purchase
          ? new Date(userDetails.date_of_purchase).toLocaleDateString("en-GB")
          : "",
      },
      { label: "Address", value: userDetails.address },
    ]
    : [];

  const mapUrl = userDetails?.map_image_url;

  const handlePinsChange = useCallback((pins: Pin[]) => {
    if (pins.length < 2) {
      setGateOptions([]);
      return;
    }
    const options: string[] = [];
    for (let i = 0; i < pins.length; i++) {
      const from = i + 1;
      const to = i === pins.length - 1 ? 1 : i + 2;
      options.push(`P${from}-P${to}`);
    }
    setGateOptions(options);
  }, []);

  // ⬇⬇⬇ CHANGE: handler now passes just the wall index. The engine inside
  // CanvasArea derives rotation from (wallIndex, polygon, northAngle).
  const handleGateChange = useCallback((value: string) => {
    if (!value) return;
    const match = value.match(/^P(\d+)-P(\d+)$/);
    if (!match) return;

    const fromIdx = parseInt(match[1], 10) - 1; // P1 → 0
    const toIdx = parseInt(match[2], 10) - 1;

    // Wall i goes from polygon[i] → polygon[(i+1) % n], so wallIndex = fromIdx.
    canvasRef.current?.rotateCompassToGate(fromIdx, toIdx);
  }, []);

  if (loading) return <CustomLoader loading={loading} />;

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav
        items={[
          { label: "Vastu Analysis", href: "/energy-vastu" },
          { label: "Energy Vastu Analyse" },
        ]}
      />

      <CustomAnalysisComponent
        title="Vastu Energy Analysis"
        reportListHref="/list/energy-vastu"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-3 gap-y-2">
          {details.map((item) => (
            <Field key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </CustomAnalysisComponent>

      <article className="w-full h-full mt-4 rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
        <CanvasToolbar
          onMove={() => setTool("move")}
          onPin={() => setTool("pin")}
          onTool={() => setTool("tool")}
          onDivisionChange={setDiv}
          onDegreeChange={setDegree}
          onUndo={() => canvasRef.current?.undo()}
          onDelete={() => canvasRef.current?.deleteAll()}
          onRotateLeft={() => canvasRef.current?.rotateLeft()}
          onRotateRight={() => canvasRef.current?.rotateRight()}
          onZoomIn={() => canvasRef.current?.zoomIn()}
          onZoomOut={() => canvasRef.current?.zoomOut()}
          onMaximize={() => canvasRef.current?.fitToScreen()}
          gateOptions={gateOptions}
          onGateChange={handleGateChange}
        />

        <div className="mt-4">
          <CanvasArea
            ref={canvasRef}
            mapUrl={mapUrl ?? ""}
            tool={tool}
            division={division}
            degree={degree}
            onPinsChange={handlePinsChange}
          />
        </div>
      </article>
    </section>
  );
};

export default EnergyVastuAnalyse;