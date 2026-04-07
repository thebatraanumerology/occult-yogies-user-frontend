import CustomTable from "@/src/components/CustomTable";
import {
  deleteVastuAnalysisRecordByID,
  getListData,
} from "@/src/services/energyVastu/VastuAPIFunctions";
import { TableColumn, TableRow } from "@/src/types/vastuTypes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const COLUMNS: TableColumn[] = [
  { key: "full_name", label: "Full Name" },
  { key: "mobile_number", label: "Mobile Number" },
];

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

const EnergyVastuList = () => {
  const handleExport = (type: string) => console.log("Export", type);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TableRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await getListData(page);
      setData(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleView = (row: TableRow) => {
    navigate(`/energy-vastu/${row.id}`);
  };

  const handleDelete = async (row: TableRow) => {
    try {
      setLoading(true);
      const id = typeof row.id === "number" ? row.id : Number(row.id);
      await deleteVastuAnalysisRecordByID(id);

      // If deleting the last record on a non-first page, go back one page
      const isLastOnPage = data.length === 1 && currentPage > 1;
      const nextPage = isLastOnPage ? currentPage - 1 : currentPage;

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      } else {
        await fetchData(currentPage);
      }
    } catch (error) {
      console.error("Failed to delete data:", error);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (page: number) => {
    if (!pagination) return;
    if (page < 1 || page > pagination.last_page) return;
    setCurrentPage(page);
  };

  // Build page number buttons (show up to 5 pages around current)
  const getPageNumbers = () => {
    if (!pagination) return [];
    const { last_page, current_page } = pagination;
    const delta = 2;
    const range: (number | "…")[] = [];
    const start = Math.max(1, current_page - delta);
    const end = Math.min(last_page, current_page + delta);

    if (start > 1) {
      range.push(1);
      if (start > 2) range.push("…");
    }
    for (let i = start; i <= end; i++) range.push(i);
    if (end < last_page) {
      if (end < last_page - 1) range.push("…");
      range.push(last_page);
    }
    return range;
  };

  return (
    <section className="w-[80%] mx-auto mt-2">
      <CustomTable
        title="Vastu Power Analysis"
        columns={COLUMNS}
        data={data}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        onExport={handleExport}
      />

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-black/60">
            {pagination.from ?? 0}–{pagination.to ?? 0} of {pagination.total}{" "}
            records
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-lightYellow
                         text-magenta disabled:opacity-30 hover:bg-lightYellow/40 transition-colors cursor-pointer"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-lightYellow
                         text-magenta disabled:opacity-30 hover:bg-lightYellow/40 transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers().map((page, i) =>
              page === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 text-center text-black/40 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goTo(page as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium
                    border transition-colors cursor-pointer
                    ${
                      currentPage === page
                        ? "bg-magenta text-white border-magenta"
                        : "border-lightYellow text-black hover:bg-lightYellow/40"
                    }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-lightYellow
                         text-magenta disabled:opacity-30 hover:bg-lightYellow/40 transition-colors cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>

            {/* Last */}
            <button
              onClick={() => goTo(pagination.last_page)}
              disabled={currentPage === pagination.last_page}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-lightYellow
                         text-magenta disabled:opacity-30 hover:bg-lightYellow/40 transition-colors cursor-pointer"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EnergyVastuList;
