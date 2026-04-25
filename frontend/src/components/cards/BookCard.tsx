import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { Book } from '../../types/book'
import { useNavigate } from 'react-router-dom'

const BookCard = (props:{book:Book}) => {
  const navigate = useNavigate()

  return (
    <Card className="card">
      <CardContent>
        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
          {props.book.authors?.map((author) => author.name).join(", ")}
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
          {props.book.title}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          {props.book.isbn}
        </Typography>
        <Typography variant="body2">
          Total copies available: {props.book.numberOfCopiesAvailable}
        </Typography> 
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/books/${props.book.id.toString()}`)}>See more</Button>
      </CardActions>
    </Card>
  )
}

export default BookCard