import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Authpage from "./page/Authpage";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHook";
import { getUserWithToken } from "./redux/reducer/userReducer";
import RequireAuth from "./routing/RequireAuth";
import AppShell from "./layout/AppShell";
import BookList from "./page/Book/BookList";
import BookPage from "./page/Book/BookPage";
import Category from "./page/Category";
import Author from "./page/Author";
import Publisher from "./page/Publisher";
import PublisherDetail from "./page/PublisherDetail";
import Rental from "./page/Rental";
import Profilepage from "./page/Profilepage";
import ProfileEdit from "./page/ProfileEdit";
import NotFound from "./page/NotFound";
import AuthorDetail from "./page/AuthorDetail";
import CategoryDetail from "./page/CategoryDetail";
import RequireRole from "./routing/RequireRole";
import AdminShell from "./layout/AdminShell";
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminBooks from "./page/admin/AdminBooks";
import AdminAuthors from "./page/admin/AdminAuthors";
import AdminCategories from "./page/admin/AdminCategories";
import AdminPublishers from "./page/admin/AdminPublishers";
import AdminRentals from "./page/admin/AdminRentals";

const App = () => {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setAuthChecked(true);
      return;
    }

    if (user == null) {
      dispatch(getUserWithToken(token)).finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : !authChecked ? (
              <div>Loading...</div>
            ) : (
              <Authpage />
            )
          }
        />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/author" element={<Author />} />
            <Route path="/author/:id" element={<AuthorDetail />} />
            <Route path="/publisher" element={<Publisher />} />
            <Route path="/publisher/:id" element={<PublisherDetail />} />
            <Route path="/rental" element={<Rental />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </Route>

          <Route element={<RequireRole role="Admin" />}>
            <Route element={<AdminShell />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<AdminBooks />} />
              <Route path="/admin/authors" element={<AdminAuthors />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/publishers" element={<AdminPublishers />} />
              <Route path="/admin/rentals" element={<AdminRentals />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App