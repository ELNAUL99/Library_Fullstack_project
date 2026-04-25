import React, { useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchAllPublishers } from "../redux/reducer/publisherReducer";
import PublisherCard from "../components/cards/PublisherCard";

const Publisher = () => {
    const publishers = useAppSelector(state => state.publishersReducer.items);
    const totalItems = useAppSelector(state => state.publishersReducer.totalItems);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(30);

    useEffect(() => {
        dispatch(fetchAllPublishers({page: page, pageSize: pageSize}))
    }, [dispatch, page, pageSize]);

    if (!Array.isArray(publishers)) {
        return <>Loading...</>
    }

    const handleChange = (_: any, page: number) => setPage(page);
    const totalPages = Math.max(1, Math.ceil((totalItems || publishers.length) / pageSize));

    return (
        <Box className="page" sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Publishers
          </Typography>
          <Box className="grid-cards">
            {publishers?.map((publisher) => (
              <PublisherCard key={publisher.id} publisher={publisher} />
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

export default Publisher