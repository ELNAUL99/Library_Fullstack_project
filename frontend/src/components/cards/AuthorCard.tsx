import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Author } from '../../types/author'

const AuthorCard = (props:{author:Author}) => {
    const navigate = useNavigate()

    return (
        <Card className="card">
            <CardContent>
                <Typography variant='h6' component="div" sx={{ fontWeight: 800 }}>
                    {props.author.name}
                </Typography>
                <Typography sx={{mb:1.5}} color="text.secondary">
                    {props.author.nationality}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => navigate(`/author/${props.author.id.toString()}`)}>
                    {props.author.name}'s Books
                </Button>
            </CardActions>
        </Card>
    )
}

export default AuthorCard