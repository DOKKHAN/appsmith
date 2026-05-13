export default {
    async login() {
        if (!inp_email.text || !inp_password.text) {
            showAlert("Por favor, llena todos los campos", "warning");
            return;
        }

        try {
            const data = await Query_login.run();

            // Si data tiene algo, es porque el email Y la contraseña coincidieron en el SQL
            if (data && data.length > 0) {
                const user = data[0];

                // Guardamos todo en el store
                await storeValue("user_id", user.id);
                await storeValue("user_name", user.nombre);
                await storeValue("tenant_schema", user.tenant_esquema);
                await storeValue("user_role", user.rol);
                
                // IMPORTANTE: Inicializar la pestaña para que el Sidebar funcione
                await storeValue("selectedTab", "Inicio");

                showAlert("Bienvenido de nuevo, " + user.nombre + " - " + user.rol, "success");
                navigateTo("Home V2");
                
            } else {
                // Si llega aquí, es porque el SELECT no encontró filas (email o pass mal)
                showAlert("Email o contraseña incorrectos", "error");
            }
        } catch (error) {
            showAlert("Error de base de datos: " + error.message, "error");
            console.error(error);
        }
    }
}
