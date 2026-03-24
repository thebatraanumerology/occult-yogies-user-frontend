import CustomTable from "@/src/components/CustomTable";
import { TableColumn, TableRow } from "@/src/types/vastuTypes";

const COLUMNS: TableColumn[] = [
  { key: "full_name",     label: "Full Name" },
  { key: "mobile_number", label: "Mobile Number" },
];
 
const MOCK_DATA: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  full_name: "Vivek Pathak",
  mobile_number: "989999999",
}));

const EnergyVastuList = () => {
    const handleView   = (row: TableRow) => console.log("View",   row); // TODO: open modal / navigate
  const handleEdit   = (row: TableRow) => console.log("Edit",   row); // TODO: open edit modal
  const handleDelete = (row: TableRow) => console.log("Delete", row); // TODO: call delete API
  const handleExport = (type: string)  => console.log("Export", type);

  return (
    <section className="w-[80%] mx-auto mt-2">
       <CustomTable
        title="Vastu Power Analysis"
        columns={COLUMNS}
        data={MOCK_DATA}
        loading={false}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </section>
  );
};

export default EnergyVastuList;