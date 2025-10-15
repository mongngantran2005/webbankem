import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";

function ShopLayout (){
    return (
        <div>
            <Header/>
            <Nav/>

            <div className="row-content">
       
                <Outlet/>
            </div>
            <Footer/>
        </div>
        )
}
export default ShopLayout;