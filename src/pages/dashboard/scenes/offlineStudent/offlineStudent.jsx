import { useState, useEffect } from "react";
import TableComponent from "../../../../components/table";
import { Button } from "@mui/material";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const OfflineStudentTable = () => {
  const [codes, setCodes] = useState([]); // Local state for handling codes
  const [tab, setTab] = useState("offline"); // State for switching between tabs
  const [sortBy, setSortBy] = useState("generatedDate"); // Sorting state
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false); // Loading state

  // Table columns
  const columns = [
    { id: "code", label: "Code" },
    { id: "generatedDate", label: "Generated Date" },
    { id: "generatedTime", label: "Generated Time" },
    {
      id: "used",
      label: "Used",
      renderCell: (row) => (row.used ? "Yes" : "No"),
    },
    {
      id: "usedDate",
      label: "Used Date",
      renderCell: (row) => (row.usedDate ? row.usedDate : "N/A"),
    },
    {
      id: "usedTime",
      label: "Used Time",
      renderCell: (row) => (row.usedTime ? row.usedTime : "N/A"),
    },
    {
      id: "studentType",
      label: "Student Type",
      renderCell: (row) => (row.studentType ? row.studentType : "N/A"),
    },
    {
      id: "amountPaid",
      label: "Amount Paid",
      renderCell: (row) => (row.amountPaid ? row.amountPaid : "N/A"),
    },
  ];

  const fetchCodes = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:3500/api/v1/get-all-codes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Log the response to inspect its structure

        // Assuming data.codes contains the array of codes
        const codesArray = data.codes || [];

        if (Array.isArray(codesArray)) {
          // Sort the codes by generated date and time (newest first)
          codesArray.sort((a, b) => {
            const dateA = new Date(`${a.generatedDate} ${a.generatedTime}`);
            const dateB = new Date(`${b.generatedDate} ${b.generatedTime}`);
            return dateB - dateA; // Sort by descending order
          });

          setCodes(codesArray); // Update local state with sorted data
        } else {
          console.error("Expected an array but got:", typeof codesArray);
        }
      } else {
        console.error("Failed to fetch codes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Filter codes based on the selected tab (online or offline)
  const filteredCodes = codes.filter((code) => code.studentType === tab);

  return (
    <div>
      {/* Tab Section */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Button
          onClick={() => setTab("offline")}
          variant="contained"
          color="secondary"
        >
          Offline Codes
        </Button>
        <Button
          onClick={() => setTab("online")}
          variant="contained"
          color="secondary"
        >
          Online Codes
        </Button>
      </div>

      {/* Fetching Button */}
      <Button
        onClick={fetchCodes}
        variant="contained"
        color="secondary"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Fetching Codes..." : "Fetch Codes"}
      </Button>

      {/* Table Display */}
      <TableComponent
        columns={columns}
        tableHeader={`${tab === "offline" ? "Offline" : "Online"} Generated Codes`}
        data={filteredCodes} // Use the filtered codes based on the tab
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={(columnId) => {
          const isAsc = sortBy === columnId && sortDirection === "asc";
          setSortDirection(isAsc ? "desc" : "asc");
          setSortBy(columnId);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </div>
  );
};

export default withDashboardWrapper(OfflineStudentTable);
