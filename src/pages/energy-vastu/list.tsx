import CustomTable from "@/src/components/CustomTable";
import { deleteVastuAnalysisRecordByID, getListData } from "@/src/services/energyVastu/VastuAPIFunctions";
import { TableColumn, TableRow } from "@/src/types/vastuTypes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLUMNS: TableColumn[] = [
  { key: "full_name",     label: "Full Name" },
  { key: "mobile_number", label: "Mobile Number" },
];


const EnergyVastuList = () => {
  const handleEdit   = (row: TableRow) => console.log("Edit",   row); // TODO: open edit modal
  const handleExport = (type: string)  => console.log("Export", type);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TableRow[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getListData();
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleView   = (row: TableRow) => {
    console.log("View",   row);
    navigate(`/energy-vastu/${row.id}`);
  };

  const handleDelete = async (row: TableRow) => {
    try {
      setLoading(true);
      const id = typeof row.id === 'number' ? row.id : Number(row.id); 
      const res = await deleteVastuAnalysisRecordByID(id);
      console.log("Delete response:: ", res);
      await fetchData();

    } catch (error) {
      console.error("Failed to delete data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-[80%] mx-auto mt-2">
       <CustomTable
        title="Vastu Power Analysis"
        columns={COLUMNS}
        data={data}
        loading={loading}
        onView={handleView}
        // onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </section>
  );
};

export default EnergyVastuList;