import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Card from './components/Card';
import CompanyDetail from './pages/CompanyDetail'; // Update import path
import './App.css';

function App() {
    const companies = [
        {
            name: "Apple",
            stockValue: "150.00",
            imageUrl: "https://imgs.search.brave.com/sRicGTe72ucwgB8_fo0xtbJ1ADDp2eKIA0xcZ7yy5cs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvYXBwbGUtbG9n/by1waWN0dXJlcy12/MnEza2Nqamk3dDQ5/emxvLmpwZw"
        },
        {
            name: "Google",
            stockValue: "2800.00",
            imageUrl: "https://imgs.search.brave.com/vTLhO_pzN0kiabVcKVcP48PrjPGviLQ4mBX6A0nV34c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE2LzEx/L05ldy1Hb29nbGUt/TG9nby00OTd4NTAw/LmpwZw"
        },
        {
            name: "DoorDash",
            stockValue: "180.00",
            imageUrl: "https://imgs.search.brave.com/hPK6prR5Yuzyn-eVEiTnMfwMfuY5T96OMpJXOIMLDXk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzgxLzcwLzMw/LzM2MF9GXzQ4MTcw/MzAwMl9mNUxONkI4/ZDBOVUtKelBvdTAx/YkZsaXNTN0NqVnEy/OC5qcGc"
        },
        {
            name: "Uber",
            stockValue: "50.00",
            imageUrl: "https://imgs.search.brave.com/COGgq7Ueq6eSigdaAcaZfoxa8AEVxTNQcBIxxKxk3Eo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by8zZC1yZW5kZXIt/dWJlci1sb2dvLWV4/dHJ1ZGVkLWdsb3Nz/eS1ibGFjay1hY3J5/bGljLWdlbnRseS1z/cGlubmluZy13aGl0/ZS1uZW9uLWhpZ2hs/aWdodHMtYXJvdW5k/XzEwMjA0OTUtNzgx/MDQ3LmpwZz9zZW10/PWFpc19oeWJyaWQ"
        }
    ];

    return (
        <Router>
            <Navbar />
            <h1>Welcome to My App!</h1>
            <div className="card-container">
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            companies.map((company, index) => (
                                <Card 
                                    key={index} 
                                    companyName={company.name} 
                                    stockValue={company.stockValue} 
                                    imageUrl={company.imageUrl} 
                                    onClick={() => window.location.href=`/company/${index}`} // Navigate to detail page
                                />
                            ))
                        } 
                    />
                    <Route path="/company/:id" element={<CompanyDetail companies={companies} />} /> {/* Detail page route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
