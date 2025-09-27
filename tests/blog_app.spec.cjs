const { test, expect, describe } = require('@playwright/test');
const BACKEND_PORT = 3009; // Puerto de tu servidor backend de pruebas

describe('Blog app', () => {

    test.beforeEach(async ({ page, request }) => {
        // Reinicia la base de datos para asegurar un estado limpio (Debe responder 204)
        const resetResponse = await request.post(`http://localhost:${BACKEND_PORT}/api/testing/reset`);
        await expect(resetResponse.status()).toBe(204);

        // Pausa de estabilidad: 1 segundo. CRÍTICO para asegurar que el reseteo de DB remota se complete.
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Crea el USUARIO PRINCIPAL (CREADOR) con credenciales específicas
        const createUserResponse = await request.post(`http://localhost:${BACKEND_PORT}/api/users`, {
            data: {
                name: 'Test makioma',
                username: 'testmaki',
                password: 'test123456'
            }
        });

        // Asegura que el usuario se haya creado correctamente (status 201)
        await expect(createUserResponse.status()).toBe(201);

        // Navega a la página de la aplicación
        await page.goto('http://localhost:5173');
    });

    // ----------------------------------------------------------------------

    describe('Login', () => {
        // ... (Pruebas de Login existentes)
        test('succeeds with correct credentials', async ({ page }) => {
            // 1. Rellena y dispara el login
            await page.getByPlaceholder('username').fill('testmaki');
            await page.getByPlaceholder('password').fill('test123456');

            // 2. Espera la respuesta exitosa del servidor (status 200)
            const loginResponsePromise = page.waitForResponse(response =>
                response.url().includes('/api/login') && response.status() === 200
            );

            await page.getByRole('button', { name: 'Log in' }).click();
            await loginResponsePromise;
            await expect(page.getByText('Logged in as: testmaki ')).toBeVisible();

            // 3. Verifica que el formulario de login desaparezca
            await expect(page.getByPlaceholder('username')).not.toBeVisible();
        });

        // ----------------------------------------------------------------------

        test('fails with wrong credentials', async ({ page }) => {
            // 1. Usa credenciales incorrectas
            await page.getByPlaceholder('username').fill('wronguser');
            await page.getByPlaceholder('password').fill('wrongpassword');
            await page.getByRole('button', { name: 'Log in' }).click();

            // 2. Espera la respuesta de error del servidor (status 401)
            await page.waitForResponse(response =>
                response.url().includes('/api/login') && response.status() === 401
            );

            // 4. Verifica que el formulario de login siga visible
            await expect(page.getByPlaceholder('username')).toBeVisible();
        });
    });

    // ----------------------------------------------------------------------

    describe('When logged in', () => {
        const blogTitle = 'Blog creado por prueba E2E (5.19)';
        const blogAuthor = 'Playwright Test';
        const blogUrl = 'http://e2e.test.com/519';

        // El beforeEach de este bloque se encarga del LOGIN
        test.beforeEach(async ({ page }) => {
            // Inicia sesión con el usuario creado en el beforeEach principal de 'Blog app'
            await page.getByPlaceholder('username').fill('testmaki');
            await page.getByPlaceholder('password').fill('test123456');
            await page.getByRole('button', { name: 'Log in' }).click();

            // Espera a que el nombre de usuario se muestre para confirmar el inicio de sesión
            await expect(page.getByText('Logged in as: testmaki ')).toBeVisible();
        });

        // Prueba 5.19: Un nuevo blog puede ser creado.
        test('a new blog can be created', async ({ page }) => {
            // ... (Tu código existente para crear el blog)
            await page.getByRole('button', { name: 'Create new blog' }).click();
            await page.getByPlaceholder('Title').fill(blogTitle);
            await page.getByPlaceholder('Author').fill(blogAuthor);
            await page.getByPlaceholder('Url').fill(blogUrl);
            await page.getByRole('button', { name: 'Create' }).click();
            await expect(page.locator('.success')).toContainText(`El blog se ha añadido con exito`);
            const newBlogContainer = page.locator(`.blog-item:has-text("${blogTitle}")`);
            await expect(newBlogContainer).toBeVisible();
            await expect(newBlogContainer).toContainText(blogTitle);
            await expect(newBlogContainer).toContainText(blogAuthor);
        });

        // Prueba 5.19 (Parte 2): URL, Likes y botón 'hide' se muestran al hacer click en 'view'
        test('url, likes and user are shown when view button is clicked', async ({ page }) => {
            // Aseguramos que el blog existe (usa la prueba anterior para crearlo rápidamente)
            await page.getByRole('button', { name: 'Create new blog' }).click();
            await page.getByPlaceholder('Title').fill(blogTitle);
            await page.getByPlaceholder('Author').fill(blogAuthor);
            await page.getByPlaceholder('Url').fill(blogUrl);
            await page.getByRole('button', { name: 'Create' }).click();
            await expect(page.locator('.success')).toBeVisible(); // Esperar la respuesta

            // 1. Localizar el CONTENEDOR del blog.
            const blogContainer = page.locator(`.blog-item:has-text("${blogTitle}")`);

            // 2. Hacemos clic en el botón 'view'
            await blogContainer.getByRole('button', { name: 'view' }).click();

            // 3. Verificamos que los detalles adicionales son visibles y que el botón ha cambiado.
            await expect(blogContainer.getByText(`Url: ${blogUrl}`)).toBeVisible();
            await expect(blogContainer.getByText('Likes: 0')).toBeVisible();
            await expect(blogContainer.getByRole('button', { name: 'like' })).toBeVisible();
            await expect(blogContainer.getByRole('button', { name: 'hide' })).toBeVisible();

            // 4. Opcional: Ocultar el blog y verificar el estado final
            await blogContainer.getByRole('button', { name: 'hide' }).click();
            await expect(blogContainer.getByText(`Url: ${blogUrl}`)).not.toBeVisible();
        });


        // ----------------------------------------------------------------------
        // NUEVAS PRUEBAS
        // ----------------------------------------------------------------------

        /** 5.21: El usuario que creó un blog puede eliminarlo. */
        test('a blog can be deleted by its creator', async ({ page }) => {
            const blogTitleToDelete = 'Blog para ser eliminado (5.21)';

            // Paso 1: Crear un blog para eliminar.
            await page.getByRole('button', { name: 'Create new blog' }).click();
            await page.getByPlaceholder('Title').fill(blogTitleToDelete);
            await page.getByPlaceholder('Author').fill('Usuario Eliminador');
            await page.getByPlaceholder('Url').fill('http://delete.me');
            await page.getByRole('button', { name: 'Create' }).click();
            await expect(page.locator('.success')).toBeVisible();

            // Ubicar el blog creado.
            const blogContainer = page.locator(`.blog-item:has-text("${blogTitleToDelete}")`);

            // Paso 2: Mostrar los detalles para ver el botón 'Eliminar'.
            await blogContainer.getByRole('button', { name: 'view' }).click();

            // Paso 3: Hacer clic en el botón 'Eliminar'
            await blogContainer.getByRole('button', { name: 'Eliminar' }).click();

            // Paso 4: Aceptar la confirmación del modal.
            // Esto asume que tu modal tiene un botón de confirmación con el texto "Sí"
            await page.getByRole('button', { name: 'Sí' }).click();

            // Paso 5: Aserción: Verificar que el blog ya no está en la página.
            await expect(blogContainer).not.toBeVisible();
        });

        /** 5.22: Solo el creador puede ver el botón delete. */
        test('only the creator can see the delete button', async ({ page, request }) => {
            const blogTitleOther = 'Blog del Creador (5.22)';
            const otherUser = {
                username: 'otheruser',
                password: 'other123',
                name: 'Otro Usuario'
            };

            // Paso 1: Crear el segundo usuario.
            const createUser2Response = await request.post(`http://localhost:${BACKEND_PORT}/api/users`, { data: otherUser });
            await expect(createUser2Response.status()).toBe(201);

            // Paso 2: Crear el blog con el USUARIO CREADOR (testmaki).
            await page.getByRole('button', { name: 'Create new blog' }).click();
            await page.getByPlaceholder('Title').fill(blogTitleOther);
            await page.getByPlaceholder('Author').fill('El Creador');
            await page.getByPlaceholder('Url').fill('http://testmaki.blog');
            await page.getByRole('button', { name: 'Create' }).click();
            await expect(page.locator('.success')).toBeVisible();

            // Paso 3: Creador: Verificar visibilidad del botón 'Eliminar' (debe ser visible).
            const blogContainer = page.locator(`.blog-item:has-text("${blogTitleOther}")`);
            await blogContainer.getByRole('button', { name: 'view' }).click();
            await expect(blogContainer.getByRole('button', { name: 'Eliminar' })).toBeVisible();

            // Paso 4: Cerrar sesión del CREADOR.
            await page.getByRole('button', { name: 'Log out' }).click();

            // Paso 5: Iniciar sesión como OTRO USUARIO.
            await page.getByPlaceholder('username').fill(otherUser.username);
            await page.getByPlaceholder('password').fill(otherUser.password);
            await page.getByRole('button', { name: 'Log in' }).click();
            await expect(page.getByText(`Logged in as: ${otherUser.username}`)).toBeVisible();

            // Paso 6: Otro Usuario: Verificar NO visibilidad del botón 'Eliminar'.
            const blogContainerOther = page.locator(`.blog-item:has-text("${blogTitleOther}")`);
            
            // Mostrar los detalles
            await blogContainerOther.getByRole('button', { name: 'view' }).click();

            // Aserción clave: el botón NO debe ser visible.
            await expect(blogContainerOther.getByRole('button', { name: 'Eliminar' })).not.toBeVisible();
        });

        /** 5.23: Los blogs están ordenados por likes. */
        test('blogs are ordered by likes, with the one having most likes first', async ({ page, request }) => {
            // Nota: Usamos la API para crear los blogs y asignar likes rápidamente.
            const loginResponse = await request.post(`http://localhost:${BACKEND_PORT}/api/login`, {
                data: { username: 'testmaki', password: 'test123456' },
            });
            const token = (await loginResponse.json()).token;
            const headers = { Authorization: `Bearer ${token}` };

            // Crear blogs directamente via API con likes pre-asignados
            await request.post(`http://localhost:${BACKEND_PORT}/api/blogs`, { data: { title: 'Blog con 0 Likes', author: 'C. Autor', url: 'http://0likes.com', likes: 0 }, headers });
            await request.post(`http://localhost:${BACKEND_PORT}/api/blogs`, { data: { title: 'Blog con 10 Likes', author: 'B. Autor', url: 'http://10likes.com', likes: 10 }, headers });
            await request.post(`http://localhost:${BACKEND_PORT}/api/blogs`, { data: { title: 'Blog con 5 Likes', author: 'A. Autor', url: 'http://5likes.com', likes: 5 }, headers });


            // Paso 2: Recargar la página para obtener la lista ordenada
            await page.reload();

            // Paso 3: Aserción: Verificar el orden de los blogs.
            // Obtenemos TODOS los elementos que representan un blog en la página.
            const blogContainers = page.locator('.blog-item');

            // El primer blog (índice 0) debe ser el de 10 Likes
            await expect(blogContainers.nth(0)).toContainText('Blog con 10 Likes');

            // El segundo blog (índice 1) debe ser el de 5 Likes
            await expect(blogContainers.nth(1)).toContainText('Blog con 5 Likes');

            // El tercer blog (índice 2) debe ser el de 0 Likes
            await expect(blogContainers.nth(2)).toContainText('Blog con 0 Likes');
        });
    });
});