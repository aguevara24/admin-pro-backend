const getMenuFrontEnd = ( role = 'USER_ROLE') => {
    const menu = [
        {
            title: 'Principal',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Main', url: '/' },
                { title: 'ProgressBar', url: 'progress' },
                { title: 'Gráficas', url: 'grafica1' },
                { title: 'rxjs', url: 'rxjs' },
                { title: 'Promesas', url: 'promise' },
            ]
        },
        {
            title: 'Mantenimientos',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // { title: 'Usuarios', url: 'users' },
                { title: 'Hospitales', url: 'hospitals' },
                { title: 'Médicos', url: 'doctors' },

            ]
        }
    ];

    if ( role === 'ADMIN_ROLE' ) {
        menu[1].submenu.unshift({ title: 'Usuarios', url: 'users' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}