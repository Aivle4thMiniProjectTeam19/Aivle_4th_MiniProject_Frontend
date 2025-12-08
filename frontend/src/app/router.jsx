import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import BookListPage from '../pages/BookListPage';
import BookDetailPage from '../pages/BookDetailPage';
import BookFormPage from '../pages/BookFormPage';
import Login from '../pages/Login';  // 추가
import BookEditPage from '../pages/BookEditPage'; // 추가2

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'login', element: <Login /> },  // 추가
            { path: 'books', element: <BookListPage /> },
            // 1. 글쓰기 페이지 (순서 중요: :id보다 위에 있어야 함)
            { path: 'books/new', element: <BookFormPage /> },

            //  2. 수정 페이지 경로 추가2
            // :id는 수정할 책의 번호가 들어갈 자리입니다.
            // 상세 페이지 코드에서 navigate(`/books/edit/${id}`)로 보냈으므로,
            // 라우터에서도 books/edit/:id 로 받아야 합니다.
            { path: 'books/edit/:id', element: <BookEditPage /> },

            // 2. 상세 페이지 (:id는 변수처럼 1, 2, 3 등 아무 숫자나 들어올 수 있다는 뜻)
            { path: 'books/:id', element: <BookDetailPage /> },
        ],
    },
]);

export default router;