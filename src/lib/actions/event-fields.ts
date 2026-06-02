// Helper condivisi per leggere i campi evento da una FormData
// (usati sia da submitProposal che da updateEvent).

export function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

// Campi comuni di un evento/proposta letti dal form.
export function readEventContent(fd: FormData) {
  return {
    title: str(fd, "title"),
    description: optStr(fd, "description"),
    start_date: str(fd, "start_date"),
    end_date: str(fd, "end_date"),
    region: str(fd, "region"),
    official_url: optStr(fd, "official_url"),
    cover_image_key: optStr(fd, "cover_image_key"),
    start_comune: str(fd, "start_comune"),
    start_provincia: str(fd, "start_provincia"),
    end_comune: optStr(fd, "end_comune"),
    end_provincia: optStr(fd, "end_provincia"),
  };
}
