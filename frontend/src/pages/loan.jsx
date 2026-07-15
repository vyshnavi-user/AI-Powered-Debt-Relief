import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import api from "../api";

function Loan() {

    const userId = localStorage.getItem("user_id");

    const [form, setForm] = useState({
        lender: "",
        loan_type: "",
        outstanding: "",
        emi: "",
        overdue: "",
        interest_rate: "",
        start_date: "",
        end_date: ""
    });

    const [loans, setLoans] = useState([]);

    const [recommendedEmi, setRecommendedEmi] = useState(0);

    const [duration, setDuration] = useState(0);

    const [closureDate, setClosureDate] = useState("");

    useEffect(() => {

        loadLoans();

    }, []);

    useEffect(() => {

        calculateLoan();

    }, [
        form.outstanding,
        form.start_date,
        form.end_date
    ]);

    const calculateLoan = async () => {

        const income = Number(localStorage.getItem("income")) || 50000;

        const expenses = Number(localStorage.getItem("expenses")) || 20000;

        const surplus = income - expenses;

        const emi = Math.round(surplus * 0.7);

        setRecommendedEmi(emi);

        if (form.start_date && form.end_date) {

            const start = new Date(form.start_date);

            const end = new Date(form.end_date);

            const months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            setDuration(months);

            const close = new Date();

            close.setMonth(close.getMonth() + months);

            setClosureDate(close.toLocaleDateString());

        }

    };

    const loadLoans = async () => {

        try {

            const response = await api.get("/loans");

            setLoans(response.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const addLoan = async () => {

        try {

            await api.post("/loan", {

                user_id: Number(userId),

                lender: form.lender,

                loan_type: form.loan_type,

                outstanding: Number(form.outstanding),

                emi: Number(form.emi),

                overdue: Number(form.overdue),

                interest_rate: Number(form.interest_rate),

                start_date: form.start_date,

                end_date: form.end_date,

                duration_months: duration,

                recommended_emi: recommendedEmi,

                expected_closure_date: form.end_date

            });

            alert("Loan Added Successfully");

            setForm({
                lender: "",
                loan_type: "",
                outstanding: "",
                emi: "",
                overdue: "",
                interest_rate: "",
                start_date: "",
                end_date: ""
            });

            loadLoans();

        }

        catch (err) {

            alert(err.response?.data?.detail || "Unable to Add Loan");

        }

    };

    const deleteLoan = async(id)=>{

        if(!window.confirm("Delete Loan?")) return;

        await api.delete(`/loan/${id}`);

        loadLoans();

    };

    return (

<>
<Navbar />

<div className="d-flex">

<Sidebar />

<div
className="container-fluid"
style={{
marginLeft:"260px",
padding:"30px"
}}
>

<h2 className="mb-4">
Loan Management
</h2>

<div className="card shadow p-4">

<div className="row">

<div className="col-md-6">
<label>Lender</label>

<input
className="form-control mb-3"
value={form.lender}
onChange={(e)=>setForm({...form,lender:e.target.value})}
/>
</div>

<div className="col-md-6">
<label>Loan Type</label>

<select
className="form-control mb-3"
value={form.loan_type}
onChange={(e)=>setForm({...form,loan_type:e.target.value})}
>

<option value="">Select</option>
<option>Home Loan</option>
<option>Personal Loan</option>
<option>Education Loan</option>
<option>Vehicle Loan</option>
<option>Credit Card</option>

</select>

</div>

<div className="col-md-4">

<label>Outstanding Amount</label>

<input
type="number"
className="form-control mb-3"
value={form.outstanding}
onChange={(e)=>setForm({...form,outstanding:e.target.value})}
/>

</div>

<div className="col-md-4">

<label>Monthly EMI</label>

<input
type="number"
className="form-control mb-3"
value={form.emi}
onChange={(e)=>setForm({...form,emi:e.target.value})}
/>

</div>

<div className="col-md-4">

<label>Interest Rate (%)</label>

<input
type="number"
className="form-control mb-3"
value={form.interest_rate}
onChange={(e)=>setForm({...form,interest_rate:e.target.value})}
/>

</div>

<div className="col-md-4">

<label>Overdue Months</label>

<input
type="number"
className="form-control mb-3"
value={form.overdue}
onChange={(e)=>setForm({...form,overdue:e.target.value})}
/>

</div>

<div className="col-md-4">

<label>Loan Start Date</label>

<input
type="date"
className="form-control mb-3"
value={form.start_date}
onChange={(e)=>setForm({...form,start_date:e.target.value})}
/>

</div>

<div className="col-md-4">

<label>Loan End Date</label>

<input
type="date"
className="form-control mb-3"
value={form.end_date}
onChange={(e)=>setForm({...form,end_date:e.target.value})}
/>

</div>

</div>

<hr/>

<div className="row">

<div className="col-md-4">

<div className="alert alert-success">

<h5>Recommended EMI</h5>

<h3>

₹{recommendedEmi}

</h3>

</div>

</div>

<div className="col-md-4">

<div className="alert alert-primary">

<h5>Loan Duration</h5>

<h3>

{duration} Months

</h3>

</div>

</div>

<div className="col-md-4">

<div className="alert alert-warning">

<h5>Expected Closure</h5>

<h4>

{closureDate}

</h4>

</div>

</div>

</div>

<button
className="btn btn-primary w-100 mt-3"
onClick={addLoan}
>

Save Loan

</button>

</div>

<h3 className="mt-5">

My Loans

</h3>

<table className="table table-bordered table-hover mt-3">

<thead className="table-dark">

<tr>

<th>Lender</th>

<th>Type</th>

<th>Outstanding</th>

<th>EMI</th>

<th>Interest</th>

<th>Duration</th>

<th>Recommended EMI</th>

<th>Closure</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

loans.map((loan)=>(

<tr key={loan.loan_id}>

<td>{loan.lender}</td>

<td>{loan.loan_type}</td>

<td>₹{loan.outstanding}</td>

<td>₹{loan.emi}</td>

<td>{loan.interest_rate}%</td>

<td>{loan.duration_months} Months</td>

<td>₹{loan.recommended_emi}</td>

<td>{loan.expected_closure_date}</td>

<td>

<button
className="btn btn-danger btn-sm"
onClick={()=>deleteLoan(loan.loan_id)}
>

Delete

</button>

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

</>

);

}

export default Loan;