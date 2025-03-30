const AdminPage: React.FC = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Admin Page</h1>
            <p>Welcome to the admin panel. Manage your application here.</p>
            <ul>
                <li><a href="/admin/users">Manage Users</a></li>
                <li><a href="/admin/settings">Settings</a></li>
                <li><a href="/admin/reports">View Reports</a></li>
            </ul>
        </div>
    );
};

export default AdminPage;