import React, { useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchAllAuthors } from "../redux/reducer/authorReducer";
import AuthorCard from "../components/cards/AuthorCard";

const Author = () => {
    const authors = useAppSelector(state => state.authorsReducer.items);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(30);

    useEffect(() => {
        dispatch(fetchAllAuthors({page: page, pageSize: pageSize}))
    }, [dispatch, page, pageSize]);

    if (!Array.isArray(authors)) {
        return <>Loading...</>
    }

    //Change Page
    const handleChange = (event:any, page:number) => {
        setPage(page);
    };

    return (
        <Box className="page" sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Authors
          </Typography>
          <Box className="grid-cards">
            {authors?.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.max(1, Math.ceil(authors.length / 30))}
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

export default Author