import { PageTitle } from "@/components";
import { AuditLogsList } from "@/components/content/auditLogs";
import { usePermission } from "@/hooks";
import { OperationAction, Resource } from "@/services/types";
import { Container, Grid, Typography } from "@mui/material";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";

import ErrorBoundary from "@/components/ErrorBoundary";
import getConfig from "@/libs/getConfig";

const appName = getConfig("appName");

function ListWrapper() {
  usePermission({ action: OperationAction.Read, resource: Resource.AuditLog }).ok_or_throw();

  return <AuditLogsList />;
}

export default function ListPage() {
  return (
    <>
      <Helmet>
        <title>{appName} | List Audit logs</title>
        <meta name="description" content=""></meta>
      </Helmet>

      <PageTitle>
        {/* Page Header */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>Audit logs List</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
            </Typography>
          </Grid>
        </Grid>
      </PageTitle>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Suspense>
                <ListWrapper />
              </Suspense>
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
