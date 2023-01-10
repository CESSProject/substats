/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 11:21:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-10 11:38:53
 * @description: about
 * @author: chenbinfa
 */
/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 11:21:36
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-27 11:52:52
 * @description: about
 * @author: chenbinfa
 */
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.less";
import Home from "./views/home";
import BlockList from "./views/block/list";
import BlockDetail from "./views/block/detail";
import TransferList from "./views/transfer/list";
import TransferDetail from "./views/transfer/detail";
import AccountList from "./views/account/list";
import AccountDetail from "./views/account/detail";
import NavBar from "./components/NavBar";
import MobileNavBar from "./components/mobile/NavBar";
import SearchBar from "./components/SearchBar";
import Demo from "./views/thTableDemo";
import { isMobile } from "@utils";
var isM = isMobile();

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				{isM ? <MobileNavBar className="page-header" /> : <NavBar className="page-header" />}
				<div className="containner">
					<div className="bg-color bg-color-1"></div>
					<div className="bg-color bg-color-2"></div>
					<SearchBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/block" element={<BlockList />} />
						<Route path="/block/:q" element={<BlockDetail />} />
						<Route path="/transfer" element={<TransferList />} />
						<Route path="/transfer/:q" element={<TransferDetail />} />
						<Route path="/account/" element={<AccountList />} />
						<Route path="/account/:q" element={<AccountDetail />} />
						<Route path="/demo" element={<Demo />} />
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
