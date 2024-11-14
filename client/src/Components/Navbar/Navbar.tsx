import './Navbar.css'

function Navbar() {
  return (
    <header className='header-section dark-nav'>
        <div className='header-content'>
            <input type="checkbox" id="menu-toggle"/>
            <label htmlFor="menu-toggle" className="menu-icon">
                <span></span>
                <span></span>
                <span></span>
            </label>

            <nav className='nav-menu'>
                <ul>
                    <li>Lorem</li>
                    <li>Lorem</li>
                    <li>Lorem</li>
                    <li>Lorem</li>
                </ul>
            </nav>

            <h3 className='logo'>Logo</h3>

            <button className='btn'>My pages</button>
        </div>
    </header>
  );
}

export default Navbar;
