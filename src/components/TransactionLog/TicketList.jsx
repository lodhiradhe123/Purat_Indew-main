import { useEffect, useState, useMemo } from "react";
import { transactions } from "../../services/api";
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TableSortLabel, TablePagination, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid } from "@material-ui/core";
import { GetApp as GetAppIcon, Search as SearchIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

// Styles
const useStyles = makeStyles((theme) => ({
    tableContainer: {
        marginTop: theme.spacing(3),
        overflowX: "auto",
    },
    table: {
        minWidth: 650,
    },
    tableHead: {
        backgroundColor: theme.palette.primary.main,
    },
    tableHeadCell: {
        color: theme.palette.common.white,
        fontWeight: 600,
    },
    tableRow: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

const TicketList = ({ user }) => {
    const classes = useStyles();
    const [transactionData, setTransactionData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("newest");
    const [orderBy, setOrderBy] = useState("dte");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const fetchTransactionsData = async () => {
        const logsdata = { action: "read", username: user };
        try {
            const response = await transactions(logsdata);
            setTransactionData(response.data.data); // Assuming response.data.data holds the array
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactionsData();
    }, []);

    // Export data to Excel
    const exportToExcel = () => {
        const formattedData = transactionData.map(item => ({
            Time: item.dte,
            "T.ID": item.id,
            Type: item.cd,
            Reseller: item.reseller,
            User: item.name,
            Credit: item.sms,
            Price: item.pps,
            Amount: item.amt,
            Description: item.decrip,
            Service: item.service,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "TransactionData.xlsx");
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter and sort data based on search term and selected filter
    const filteredData = useMemo(() => {
        let filtered = transactionData.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (filter === "newest") {
            filtered = filtered.sort((a, b) => new Date(b.dte) - new Date(a.dte));
        } else {
            filtered = filtered.sort((a, b) => new Date(a.dte) - new Date(b.dte));
        }

        return filtered;
    }, [transactionData, searchTerm, filter]);

    return (
        <div className="flex flex-col w-full p-4">
            <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center mr-24">
              Transaction Logs
              </h1>

              <button className="invisible-disabled"></button>
            </div>
          </div>
           

            {/* Search and Filters */}
            <Grid container spacing={2} className="my-4">
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.searchField}
                        variant="outlined"
                        size="small"
                        placeholder="Search transactions"
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            label="Filter"
                        >
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="oldest">Oldest</MenuItem>
                        </Select>
                    </FormControl>
                    
                </Grid>
                <div className="mt-3 ">

                <Button
                    onClick={exportToExcel}
                    variant="outlined"
                    color="primary"
                    startIcon={<GetAppIcon />}
                >
                    Download Excel
                </Button>
                </div>
                
            </Grid>

            {/* Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            {[
                                "Time",
                                "T.ID",
                                "Type",
                                "Reseller",
                                "User",
                                "Credit",
                                "Price",
                                "Amount",
                                "Description",
                                "Service",
                            ].map((headCell) => (
                                <TableCell key={headCell} className={classes.tableHeadCell}>
                                    <TableSortLabel
                                        active={orderBy === headCell}
                                        direction={orderBy === headCell ? order : "asc"}
                                        onClick={() => handleRequestSort(headCell)}
                                    >
                                        {headCell}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? filteredData.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : filteredData
                        ).map((row, index) => (
                            <TableRow key={index} className={classes.tableRow}>
                                <TableCell>{row.dte}</TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.cd}</TableCell>
                                <TableCell>{row.reseller}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.sms}</TableCell>
                                <TableCell>{row.pps}</TableCell>
                                <TableCell>{row.amt}</TableCell>
                                <TableCell>{row.decrip}</TableCell>
                                <TableCell>{row.service}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default TicketList;
