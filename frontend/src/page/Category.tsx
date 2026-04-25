import React, { useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchAllCategories } from "../redux/reducer/categoryReducer";
import CategoryCard from "../components/cards/CategoryCard";

const Category = () => {
    const categories = useAppSelector(state => state.categoriesReducer.items);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(30);

    useEffect(() => {
        dispatch(fetchAllCategories({page: page, pageSize: pageSize}))
    }, [dispatch, page, pageSize]);

    if (!Array.isArray(categories)) {
        return <>Loading...</>
    }

    //Change Page
    const handleChange = (event:any, page:number) => {
        setPage(page);
    };

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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.max(1, Math.ceil(categories.length / 30))}
              page={page}
              variant="outlined"
              onChange={handleChange}
              shape="rounded"
              size="large"
            />
          </Box>
        </Box>
    )
}

export default Category