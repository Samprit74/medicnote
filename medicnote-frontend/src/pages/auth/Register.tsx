import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stethoscope, User, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { extractApiError } from "@/lib/errorHandler";
import { toast } from "sonner";
import type { BackendRole } from "@/types/auth.types";

type FieldErrors = Partial<Record<
  "name" | "email" | "password" | "confirm" | "specialization" | "experience" | "form",
  string
>>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<BackendRole>("ROLE_PATIENT");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isDoctor = role === "ROLE_DOCTOR";

  const clear = (k: keyof FieldErrors) =>
    setErrors((e) => ({ ...e, [k]: undefined }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    if (isDoctor) {
      if (!specialization.trim()) next.specialization = "Specialization is required for doctors.";
      if (experience === "" || Number(experience) < 0)
        next.experience = "Experience must be a non-negative number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    try {
      setLoading(true);
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(isDoctor && {
          specialization: specialization.trim(),
          experience: Number(experience),
        }),
      });
      toast.success("Account created. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      if (fieldErrors) {
        setErrors({
          name: fieldErrors.name,
          email: fieldErrors.email ?? fieldErrors.role,
          password: fieldErrors.password,
        });
      } else {
        setErrors({ form: message || "Registration failed." });
        toast.error(message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">MedicNote</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <h2 className="mb-6 text-lg font-semibold text-foreground">Sign Up</h2>

          {errors.form && (
            <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive dark:border-destructive/40 dark:bg-destructive/20">
              {errors.form}
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <Label>I am a</Label>
              <div className="flex rounded-lg bg-muted p-1">
                {(
                  [
                    { v: "ROLE_PATIENT", label: "Patient" },
                    { v: "ROLE_DOCTOR", label: "Doctor" },
                    { v: "ROLE_ADMIN", label: "Admin" },
                  ] as { v: BackendRole; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setRole(opt.v)}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                      role === opt.v
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Field
              id="name"
              label="Full name"
              icon={User}
              value={name}
              onChange={(v) => { setName(v); clear("name"); }}
              placeholder="Your full name"
              error={errors.name}
              autoComplete="name"
            />

            <Field
              id="email"
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); clear("email"); }}
              placeholder="your@email.com"
              error={errors.email}
              autoComplete="email"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                value={password}
                onChange={(v) => { setPassword(v); clear("password"); clear("confirm"); }}
                placeholder="••••••••"
                error={errors.password}
                autoComplete="new-password"
              />
              <Field
                id="confirm"
                label="Confirm"
                icon={Lock}
                type="password"
                value={confirm}
                onChange={(v) => { setConfirm(v); clear("confirm"); }}
                placeholder="••••••••"
                error={errors.confirm}
                autoComplete="new-password"
              />
            </div>

            {isDoctor && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id="specialization"
                  label="Specialization"
                  value={specialization}
                  onChange={(v) => { setSpecialization(v); clear("specialization"); }}
                  placeholder="e.g. Cardiology"
                  error={errors.specialization}
                />
                <Field
                  id="experience"
                  label="Experience (years)"
                  type="number"
                  value={experience}
                  onChange={(v) => { setExperience(v); clear("experience"); }}
                  placeholder="0"
                  error={errors.experience}
                />
              </div>
            )}
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
  error?: string;
  autoComplete?: string;
}

const Field: React.FC<FieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  autoComplete,
}) => (
  <div className="space-y-1">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={Icon ? "pl-9" : undefined}
      />
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default Register;
