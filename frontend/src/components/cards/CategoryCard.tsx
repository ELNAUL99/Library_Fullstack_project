import React from 'react'
import { Category } from '../../types/category'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CategoryCard = (props:{category:Category}) => {
    const navigate = useNavigate()

    return (
        <Card className="card">
            <CardContent>
                    <Typography variant='h6' component="div" sx={{ fontWeight: 800 }}>
                        {props.category.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => navigate(`/category/${props.category.id.toString()}`)}>
                        See more
                    </Button>
                </CardActions>
        </Card>
    )
}

export default CategoryCard