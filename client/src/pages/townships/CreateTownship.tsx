import { PageTitle, SuspenseLoader } from "@/components";
import { CreateTownshipForm } from "@/components/content/townships/forms";
import { usePermission } from "@/hooks";
import { OperationAction, Resource } from "@/services/types";
import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import getConfig from "@/libs/getConfig";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";

const appName = getConfig("appName");

function CreateFormWrapper() {
  usePermission({
    action: OperationAction.Create,
    resource: Resource.Township,
  }).ok_or_throw();

  return (
    <Card>
      <CardContent>
        <CreateTownshipForm />
      </CardContent>
    </Card>
  );
}

export default function CreatePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>{appName} | Create Township</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tooltip arrow placeholder="top" title="go back">
              <IconButton
                color="primary"
                sx={{ p: 2, mr: 2 }}
                onClick={handleBack}
              >
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={10}>
            <Typography variant="h3" component="h3" gutterBottom>
              Create a new township
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing
              minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <ErrorBoundary>
              <Suspense fallback={<SuspenseLoader />}>
                <CreateFormWrapper />
              </Suspense>
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
