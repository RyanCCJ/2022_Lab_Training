import axios from 'axios';
import React from 'react';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { rootApiIP } from '../../constant'

function NavbarComp() {
    const nav = useNavigate()

    function logout(e){
        e.preventDefault()

        axios.get(rootApiIP + "/user/logout")
        .then(res => {
            alert("Logout")
            nav("/login")
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
            alert("something error, please try again")
        })
    }

    return (
        <div>
            <Navbar bg = "dark" variant = "dark" expand = "lg">
                <Container fluid>
                    <Navbar.Brand href = "/home">Financial</Navbar.Brand>
                    <Navbar.Toggle aria-controls = "basic-navbar-nav" />
                    <Navbar.Collapse id =" basic-navbar-nav">
                        <Nav className = "ms-auto">
                            <Nav.Link href = "/database">個股綜合資料</Nav.Link>
                            <Nav.Link href = "/post_board">個股推薦</Nav.Link>
                            <Nav.Link href = "/line_memo">Line memo</Nav.Link>
                            <Nav.Link href = "/calendar">Calendar</Nav.Link>
                            <Nav.Link href = "/meeting_data">Meeting data</Nav.Link>
                            {/* <Nav.Link href = "/6">Plot</Nav.Link> */}
                            <Nav.Link href = "/industry_analysis">產業分析上傳</Nav.Link>

                            <NavDropdown title = "工具" align = "end">
                                <NavDropdown.Item href = "/stock_pricing_stratagy">股票定價策略</NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title = "更多" align = "end">
                                <NavDropdown.Item href = "/userList">成員檔案</NavDropdown.Item>
                                <NavDropdown.Item onClick = { logout }>登出</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavbarComp;