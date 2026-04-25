import React, { useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchAllCategories } from "../redux/reducer/categoryReducer";
import CategoryCard from "../components/cards/CategoryCard";

const Category = () => {
    const categories = useAppSelector(state => state.categoriesReducer.items);
    const totalItems = useAppSelector(state => state.categoriesReducer.totalItems);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(30);

    useEffect(() => {
        dispatch(fetchAllCategories({page: page, pageSize: pageSize}))
    }, [dispatch, page, pageSize]);

    if (!Array.isArray(categories)) {
        return <>Loading...</>
    }

    const handleChange = (_: any, page: number) => setPage(page);
    const totalPages = Math.max(1, Math.ceil((totalItems || categories.length) / pageSize));

    return (
        <Box className="page" sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Categories
          </Typography>
          <Box className="grid-cards">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Box>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                variant="outlined"
                onChange={handleChange}
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </Box>
    )
}

export default Category