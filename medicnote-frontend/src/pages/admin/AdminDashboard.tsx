import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { usePaginated } from "@/hooks/usePaginated";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { SectionLoader } from "@/components/common/SectionLoader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DoctorEditDialog } from "@/components/doctor/DoctorEditDialog";
import { PatientEditDialog } from "@/components/patient/PatientEditDialog";
import { doctorService } from "@/services/doctorService";
import { patientService } from "@/services/patientService";
import { toast } from "sonner";
import type { DoctorDTO, DoctorRequest } from "@/types/doctor.types";
import type { PatientDTO, PatientRequest } from "@/types/patient.types";
import { formatDate } from "@/lib/formatters";

const DoctorsTab: React.FC = () => {
  const { data, loading, error, refetch } = useApi(() => doctorService.getAllDoctors(), []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<DoctorRequest>({
    name: "",
    email: "",
    specialization: "",
    experience: 0,
  });

  const handleNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", specialization: "", experience: 0 });
    setOpen(true);
  };
  const handleEdit = (d: DoctorDTO) => {
    setEditing(d);
    setForm({
      name: d.name,
      email: d.email,
      specialization: d.specialization,
      experience: d.experience,
    });
    setOpen(true);
  };
  const handleSubmit = async (req: DoctorRequest) => {
    try {
      setSubmitting(true);
      if (editing) {
        await doctorService.updateDoctorByAdmin(editing.id, req);
        toast.success("Doctor updated");
      } else {
        await doctorService.createDoctor(req);
        toast.success("Doctor created");
      }
      setOpen(false);
      refetch();
    } catch {
      /* interceptor already toasted */
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id: DoctorDTO["id"]) => {
    try {
      await doctorService.deleteDoctor(id);
      toast.success("Doctor deleted");
      refetch();
    } catch {
      /* interceptor already toasted */
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Doctors</CardTitle>
        <Button onClick={handleNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New doctor
        </Button>
      </CardHeader>
      <CardContent>
        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          empty={!loading && (data?.length ?? 0) === 0}
          emptyTitle="No doctors yet"
          emptyDescription="Add a doctor to get started."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Specialization</th>
                  <th className="px-3 py-2 text-left">Experience</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((d) => (
                  <tr key={String(d.id)} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{d.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.email}</td>
                    <td className="px-3 py-2">{d.specialization}</td>
                    <td className="px-3 py-2">{d.experience} yrs</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(d)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button size="icon" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete doctor?"
                          description="This cannot be undone."
                          confirmLabel="Delete"
                          destructive
                          onConfirm={() => handleDelete(d.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageState>
      </CardContent>
      <DoctorEditDialog
        doctor={editing}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </Card>
  );
};

const PatientsTab: React.FC = () => {
  const { page, setPage, data, loading, error, refetch } = usePaginated<PatientDTO>(
    (p, s) => patientService.getAll(p, s),
    { initialPage: 0, initialSize: 7 }
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PatientDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (p: PatientDTO) => {
    setEditing(p);
    setOpen(true);
  };
  const handleSubmit = async (req: PatientRequest) => {
    if (!editing) return;
    try {
      setSubmitting(true);
      await patientService.updateByAdmin(editing.id, req);
      toast.success("Patient updated");
      setOpen(false);
      refetch();
    } catch {
      /* interceptor already toasted */
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id: PatientDTO["id"]) => {
    try {
      await patientService.delete(id);
      toast.success("Patient deleted");
      refetch();
    } catch {
      /* interceptor already toasted */
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          empty={!loading && (data?.content.length ?? 0) === 0}
          emptyTitle="No patients yet"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Age</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((p) => (
                  <tr key={String(p.id)} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.email}</td>
                    <td className="px-3 py-2">{p.phone}</td>
                    <td className="px-3 py-2">{p.age}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button size="icon" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete patient?"
                          description="This cannot be undone."
                          confirmLabel="Delete"
                          destructive
                          onConfirm={() => handleDelete(p.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar
            data={data ?? null}
            page={page}
            size={7}
            onPageChange={setPage}
          />
        </PageState>
      </CardContent>
      <PatientEditDialog
        patient={editing}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Manage doctors and patients.
          </p>
        </div>
        <Tabs defaultValue="doctors">
          <TabsList>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>
          <TabsContent value="doctors" className="mt-4">
            <DoctorsTab />
          </TabsContent>
          <TabsContent value="patients" className="mt-4">
            <PatientsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
