import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHook'
import { fetchBookById } from '../../redux/reducer/bookReducer'
import { Box, Button, Container, FormControl, MenuItem, Select, Tooltip, Typography } from '@material-ui/core'
import { createRental } from '../../redux/reducer/rentalReducer'

const BookPage = () => {
    const {id} = useParams()
    const user = useAppSelector(state => state.userReducer)
    const book = useAppSelector(state => state.booksReducer.selected)
    const [copyId, setCopyId] = useState<number | "">("");
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true) // add loading state

    useEffect(() => {
      async function fetchData() { // declare async function
        if (!id) return;
        await dispatch(fetchBookById(parseInt(id as string)))
        setLoading(false) // set loading state to false once data has been fetched
      }
  
      fetchData()
    }, [dispatch, id])
  
    function newRental() {
      if (!user?.id || copyId === "") return;
      dispatch(createRental({ copyId: copyId, userId: user.id }))
      setTimeout(() => {
        navigate('/rental')
      }, 500)
    }
  
    if (loading) { // conditionally render loading state
      return <div>Loading...</div>
    }

    const availableCopies = (book?.copies ?? []).filter((c) => c.isAvailable);

    return (
        <Container>
            <Box className='book-header'>
                <Typography variant='h2'>{book?.title}</Typography>
                <Typography variant='h3'>{book?.isbn}</Typography>
            </Box>
            
            <Box className='book-data'>
                <Typography variant='h5'>
                  <b>Authors:</b>{" "}
                  {book?.authors?.map((author) => (
                    <em key={author.id} style={{ marginRight: 8 }}>
                      {author.name}
                    </em>
                  ))}
                </Typography>
                <Typography variant='h5'></Typography>
            </Box>

            <Tooltip title="Rental">
                {availableCopies.length === 0 
                ? <h5>Sorry no copies available for loan</h5>
                : <>
                    <h4>Loan this book</h4>
                    <FormControl style={{ minWidth: 240, marginBottom: 12 }}>
                      <Select
                        value={copyId}
                        displayEmpty
                        onChange={(e) => setCopyId(e.target.value as number)}
                      >
                        <MenuItem value="">
                          <em>Select a copy</em>
                        </MenuItem>
                        {availableCopies.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            Copy #{c.id} ({c.publisher?.name ?? "Unknown publisher"})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div>
                      <Button
                        disabled={copyId === "" || !user?.id}
                        onClick={newRental}
                      >
                        Create Rental
                      </Button>
                    </div>
                  </>}
            </Tooltip>
        </Container>
    )
}

export default BookPage