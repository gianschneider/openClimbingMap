import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", type: "number", headerName: "ID" },
  { field: "name", headerName: "Name", width: 120 },
  { field: "einwohnerzahl", headerName: "Einwohnerzahl", width: 180 },
  { field: "flaeche", headerName: "Fläche in ha", width: 180 },
];

function FeatureTable({ features, selectedFeatureID, setSelectedFeatureID }) {
  let data = features.map((i) => {
    return {
      id: i.id_,
      name: i.values_.name,
      einwohnerzahl: i.values_.einwohnerzahl,
      flaeche: i.values_.kantonsflaeche
    };
  });

  return (
    <div style={{ margin: "1em", height: "70vh", flex: "1 1 400px" }}>
      <DataGrid
        autoPageSize
        rows={data}
        columns={columns}
        filterModel={{ items: [{ field: "id", operator: "=", value: selectedFeatureID }] }}
        rowSelectionModel={selectedFeatureID}
        sortModel={[{ field: "id", sort: "asc" }]}
        onRowSelectionModelChange={(selectionModel) => {
          // work around a bug where the selectionModel is empty when selectedFeatureID changed
          // this prevents us from deselecting rows from the table
          if (selectionModel.length === 0) return;
          else setSelectedFeatureID(selectionModel[0]);
        }}
      />
    </div>
  );
}

export default FeatureTable;
