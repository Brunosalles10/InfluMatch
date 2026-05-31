import { combinarClasses } from "@/app/utils/cn";

type AvatarProps = {
  nome: string;
  imagemUrl?: string | null;
  className?: string;
};

function gerarIniciais(nome: string) {
  return nome
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({ nome, imagemUrl, className }: AvatarProps) {
  return (
    <div
      className={combinarClasses(
        "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white",
        className,
      )}
    >
      {imagemUrl ? (
        <img
          src={imagemUrl}
          alt={nome}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{gerarIniciais(nome)}</span>
      )}
    </div>
  );
}
