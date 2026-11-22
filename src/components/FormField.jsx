export default function FormField({ label, name, type = 'text', ...props }) {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        <input className="form-control" name={name} type={type} required {...props} />
      </label>
    </div>
  )
}
