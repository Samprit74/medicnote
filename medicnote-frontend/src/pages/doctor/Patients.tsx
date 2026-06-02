import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/common/SearchInput";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginated } from "@/hooks/usePaginated";
import { patientService } from "@/services/patientService";
import { PatientCard } from "@/components/patient/PatientCard";
import { Input } from "@/components/ui/input";
import { todayIso, formatDate } from "@/lib/formatters";
import type { PatientDTO } from "@/types/patient.types";

const Patients: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">
            People who have booked an appointment with you.
          </p>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekly">This week</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <AllPatients />
          </TabsContent>
          <TabsContent value="search" className="mt-4">
            <SearchPatients />
          </TabsContent>
          <TabsContent value="today" className="mt-4">
            <TodayPatients />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <WeeklyPatients />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const renderList = (
  data: PatientDTO[] | undefined,
  loading: boolean,
  error: { message?: string } | null,
  onRetry: () => void
) => {
  const items = data ?? [];
  return (
    <PageState
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={!loading && items.length === 0}
      emptyTitle="No patients found"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PatientCard key={String(p.id)} patient={p} />
        ))}
      </div>
    </PageState>
  );
};

const AllPatients: React.FC = () => {
  const { page, setPage, size, setSize, data, loading, error, refetch } = usePaginated<PatientDTO>(
    (p, s) => patientService.getDoctorPatients(p, s),
    { initialPage: 0, initialSize: 7 }
  );
  return (
    <div>
      {renderList(data?.content, loading, error, refetch)}
      <PaginationBar data={data ?? null} page={page} size={size} onPageChange={setPage} onSizeChange={setSize} />
    </div>
  );
};

const SearchPatients: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const debounced = useDebounce(keyword, 400);
  const { page, setPage, size, setSize, data, loading, error, refetch } = usePaginated<PatientDTO>(
    (p, s) => patientService.searchPatients(debounced, p, s),
    { initialPage: 0, initialSize: 7 }
  );

  React.useEffect(() => {
    setPage(0);
  }, [debounced, setPage]);

  const isForbidden = !!error && (error as { status?: number }).status === 403;

  return (
    <div>
      <div className="mb-3 max-w-md">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          placeholder="Search patients by name..."
        />
      </div>
      {isForbidden ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800/40 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Patient search is available to doctor accounts only.
          </p>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80">
            Use the <strong>All</strong> tab to browse patients instead.
          </p>
        </div>
      ) : (
        <>
          {renderList(data?.content, loading, error, refetch)}
          <PaginationBar data={data ?? null} page={page} size={size} onPageChange={setPage} onSizeChange={setSize} />
        </>
      )}
    </div>
  );
};

const TodayPatients: React.FC = () => {
  const [date, setDate] = useState<string>(todayIso());
  const { page, setPage, data, loading, error, refetch } = usePaginated<PatientDTO>(
    (p, s) => patientService.getTodayPatients(date, p, s),
    { initialPage: 0, initialSize: 7 }
  );
  React.useEffect(() => {
    setPage(0);
  }, [date, setPage]);

  return (
    <div>
      <div className="mb-3">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {renderList(data?.content, loading, error, refetch)}
      <PaginationBar data={data ?? null} page={page} size={7} onPageChange={setPage} />
    </div>
  );
};

const WeeklyPatients: React.FC = () => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const [range, setRange] = useState({
    start: weekStart.toISOString().slice(0, 10),
    end: weekEnd.toISOString().slice(0, 10),
  });
  const { page, setPage, data, loading, error, refetch } = usePaginated<PatientDTO>(
    (p, s) => patientService.getWeeklyPatients(range.start, range.end, p, s),
    { initialPage: 0, initialSize: 7 }
  );
  React.useEffect(() => {
    setPage(0);
  }, [range.start, range.end, setPage]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Input
          type="date"
          value={range.start}
          onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={range.end}
          onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
        />
        <span className="text-xs text-muted-foreground">
          Showing {formatDate(range.start)} – {formatDate(range.end)}
        </span>
      </div>
      {renderList(data?.content, loading, error, refetch)}
      <PaginationBar data={data ?? null} page={page} size={7} onPageChange={setPage} />
    </div>
  );
};

export default Patients;
