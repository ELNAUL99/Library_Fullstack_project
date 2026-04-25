import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import { fetchAllBooks } from "../../redux/reducer/bookReducer";
import { fetchAllAuthors } from "../../redux/reducer/authorReducer";
import { fetchAllCategories } from "../../redux/reducer/categoryReducer";
import { fetchAllPublishers } from "../../redux/reducer/publisherReducer";

const StatCard = (props: { title: string; value: number }) => (
  <Card className="card">
    <CardContent>
      <Typography color="text.secondary">{props.title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
        {props.value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.booksReducer.items);
  const authors = useAppSelector((s) => s.authorsReducer.items);
  const categories = useAppSelector((s) => s.categoriesReducer.items);
  const publishers = useAppSelector((s) => s.publishersReducer.items);

  useEffect(() => {
    dispatch(fetchAllBooks(null));
    dispatch(fetchAllAuthors(null));
    dispatch(fetchAllCategories(null));
    dispatch(fetchAllPublishers(null));
  }, [dispatch]);

  return (
    <Box className="page">
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Dashboard
      </Typography>
      <Box className="grid-cards">
        <StatCard title="Books" value={books?.length ?? 0} />
        <StatCard title="Authors" value={authors?.length ?? 0} />
        <StatCard title="Categories" value={categories?.length ?? 0} />
        <StatCard title="Publishers" value={publishers?.length ?? 0} />
      </Box>
    </Box>
  );
};

export default AdminDashboard;

