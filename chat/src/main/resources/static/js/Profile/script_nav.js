function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    const allSubmenus = document.querySelectorAll('.submenu');
 
    // Close other submenus
    allSubmenus.forEach(menu => {
        if (menu !== submenu) {
            menu.classList.remove('open');
        }
    });
 
    // Toggle current submenu
    if (submenu.classList.contains('open')) {
        submenu.classList.remove('open');
    } else {
        submenu.classList.add('open');
    }
 }