import { PageTitle, UploadProductImage } from "@/components";
import { CreateCategoryForm } from "@/components/forms";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { Card, CardContent, Container, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link } from 'react-router-dom'

export default function CreateCategory() {
  return (
    <>
      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton color="primary" sx={{ p: 2, mr: 2 }} component={Link} to="/categories">
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>Create a new category</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <UploadProductImage />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <CreateCategoryForm />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
