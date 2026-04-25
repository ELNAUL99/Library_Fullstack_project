import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { Publisher } from '../../types/publisher'
import { useNavigate } from 'react-router-dom'

const PublisherCard = (props:{publisher:Publisher}) => {
    const navigate = useNavigate()

    return (
        <Card className="card">
            <CardContent>
                <Typography variant='h6' component="div" sx={{ fontWeight: 800 }}>
                    {props.publisher.name}
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {props.publisher.phone}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => navigate(`/publisher/${props.publisher.id.toString()}`)}>
                    {props.publisher.name}'s Books
                </Button>
            </CardActions>
        </Card>
  )
}

export default PublisherCard