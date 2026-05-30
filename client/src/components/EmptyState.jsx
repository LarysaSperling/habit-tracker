function EmptyState({ title, text, icon }) {
  return (
    <div className="card text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-3xl">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-2 muted">{text}</p>
    </div>
  );
}

export default EmptyState;