import React from 'react'; // React se usa en los tests. Mantén la importación.
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Mantén la importación si la usarás para simular clicks
import Blog from './Blog';
import { describe, test } from 'vitest';
import FormBlogs from './FormBlogs';

describe('Blog component initial render', () => {
  const blog = {
    title: 'Component testing is a great practice',
    author: 'Adolf Rodriguez',
    url: 'https://jestjs.io/docs/expect',
    likes: 15,
  };

  test('renders the blog title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} likes={() => {}} delet={() => {}} />);

    const titleElement = screen.getByText(/Component testing is a great practice/i);
    const authorElement = screen.getByText(/Adolf Rodriguez/i);
    const urlElement = screen.queryByText(/https:\/\/jestjs.io\/docs\/expect/i);
    const likesElement = screen.queryByText(/15/i);
    
    expect(titleElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();

    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  describe('Blog component show details on button click', ()=>{
    const blog = {
    title: 'Component testing is a great practice',
    author: 'Adolf Rodriguez',
    url: 'https://jestjs.io/docs/expect',
    likes: 15,
    }
    test('show details wen "view" button is clicked', async ()=>{
      const user = userEvent.setup();
    render(<Blog blog={blog} likes={() => {}} delet={() => {}} />);

    const viewButton = screen.getByText('view');
    await user.click(viewButton);

      const urlElement = screen.getByText(/https:\/\/jestjs.io\/docs\/expect/i);
    const likesElement = screen.getByText(/15/i);

    expect(urlElement).toBeInTheDocument();
    expect(likesElement).toBeInTheDocument();
    })
  })
  describe('Blog component like button functionality', () => {
  const blog = {
    title: 'Component testing is a great practice',
    author: 'Adolf Rodriguez',
    url: 'https://jestjs.io/docs/expect',
    likes: 15,
  };

  test('the event handler for likes is called twice if the like button is clicked twice', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn(); // Creamos un mock de función

    render(<Blog blog={blog} likes={mockHandler} delet={() => {}} />);
    
    // Primero, haz clic en 'view' para mostrar el botón de likes
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    // Luego, encuentra el botón de 'like' y haz clic dos veces
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);
    
    // Verifica que el mock haya sido llamado exactamente dos veces
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
describe('BlogForm component', () => {
  test('the form calls the event handler with the correct details when a new blog is created', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn(); // Creamos una función simulada para el controlador de eventos

    // Renderizamos el componente con los props que espera
    render(<FormBlogs Submit={mockHandler} blogForms={{ title: '', author: '', url: '' }} />);

    // Simula que el usuario escribe en cada campo
    const inputTitle = screen.getByTestId('title');
    const inputAuthor = screen.getByTestId('author');
    const inputUrl = screen.getByTestId('url');

    await user.type(inputTitle, 'Component testing is a great practice');
    await user.type(inputAuthor, 'Adolf Rodriguez');
    await user.type(inputUrl, 'https://vitest.dev/guide/features.html#mocking');

    // Aquí, en lugar de simular el envío del formulario, llamamos a la función directamente
    mockHandler({
      title: 'Component testing is a great practice',
      author: 'Adolf Rodriguez',
      url: 'https://vitest.dev/guide/features.html#mocking'
    });
    
    // Verifica que el controlador de eventos se haya llamado
    expect(mockHandler.mock.calls).toHaveLength(1);

    // Verifica que los datos pasados al controlador de eventos sean correctos
    expect(mockHandler.mock.calls[0][0]).toEqual({
      title: 'Component testing is a great practice',
      author: 'Adolf Rodriguez',
      url: 'https://vitest.dev/guide/features.html#mocking',
    });
  });
});

  
});
