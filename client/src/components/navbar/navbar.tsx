import React, { useEffect, useState } from 'react'
import './navbar.css'

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
  
    useEffect(()=> {
      window.addEventListener('scroll', ()=>{
        window.scrollY > 50 ?  setSticky(true) : setSticky(false);
      })
    },[])
  
    return (
      <nav className={`container ${sticky? 'dark-nav' : ''}`}>
        {/* <img src={logo} alt="" className='logo'/> */}
        <ul>
          <li>Home</li>
          <li>Lorem</li>
          <li>Lorem</li>
          <li>Lorem</li>
          <li><button className='btn'>My pages</button></li>
        </ul>
      </nav>
    )
  }
  
  export default Navbar