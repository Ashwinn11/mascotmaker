import Image from "next/image";

type IconSize = "sm" | "md" | "lg" | "xl" | "2xl";

/** Microsoft Fluent 3D Emoji icon names mapped to file paths in /public/icons/ */
export type FluentIcon3D =
    | "pencil"
    | "speech-balloon"
    | "clapper-board"
    | "high-voltage"
    | "artist-palette"
    | "counterclockwise"
    | "film-frames"
    | "globe"
    | "inbox-tray"
    | "sparkles"
    | "camera"
    | "check-mark"
    | "open-folder"
    | "magic-wand"
    | "waving-hand"
    | "kangaroo"
    | "woman-dancing"
    | "relieved-face"
    | "person-walking"
    | "thumbs-up"
    | "party-popper"
    | "warning"
    | "magnifying-glass"
    | "dizzy-face"
    | "classical-building";

const iconFileMap: Record<FluentIcon3D, string> = {
    "pencil": "/icons/pencil_3d.png",
    "speech-balloon": "/icons/speech_balloon_3d.png",
    "clapper-board": "/icons/clapper_board_3d.png",
    "high-voltage": "/icons/high_voltage_3d.png",
    "artist-palette": "/icons/artist_palette_3d.png",
    "counterclockwise": "/icons/counterclockwise_arrows_button_3d.png",
    "film-frames": "/icons/film_frames_3d.png",
    "globe": "/icons/globe_with_meridians_3d.png",
    "inbox-tray": "/icons/inbox_tray_3d.png",
    "sparkles": "/icons/sparkles_3d.png",
    "camera": "/icons/camera_3d.png",
    "check-mark": "/icons/check_mark_button_3d.png",
    "open-folder": "/icons/open_file_folder_3d.png",
    "magic-wand": "/icons/magic_wand_3d.png",
    "waving-hand": "/icons/waving_hand_3d.png",
    "kangaroo": "/icons/kangaroo_3d.png",
    "woman-dancing": "/icons/woman_dancing_3d.png",
    "relieved-face": "/icons/relieved_face_3d.png",
    "person-walking": "/icons/person_walking_3d.png",
    "thumbs-up": "/icons/thumbs_up_3d.png",
    "party-popper": "/icons/party_popper_3d.png",
    "warning": "/icons/warning_3d.png",
    "magnifying-glass": "/icons/magnifying_glass_tilted_left_3d.png",
    "dizzy-face": "/icons/dizzy_face_3d.png",
    "classical-building": "/icons/classical_building_3d.png",
};

const sizeMap: Record<IconSize, number> = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 56,
    "2xl": 72,
};

interface Icon3DProps {
    name: FluentIcon3D;
    size?: IconSize;
    animated?: boolean;
    className?: string;
}

export function Icon3D({
    name,
    size = "lg",
    animated = false,
    className = "",
}: Icon3DProps) {
    const px = sizeMap[size];
    const src = iconFileMap[name];

    return (
        <div
            className={`
        inline-flex items-center justify-center
        ${animated ? "animate-float" : ""}
        ${className}
      `}
        >
            <Image
                src={src}
                alt={name}
                width={px}
                height={px}
                className="drop-shadow-md"
                draggable={false}
            />
        </div>
    );
}

/** Inline 3D icon for use in buttons, labels, etc. */
export function Icon3DInline({
    name,
    size = 20,
    className = "",
}: {
    name: FluentIcon3D;
    size?: number;
    className?: string;
}) {
    const src = iconFileMap[name];
    return (
        <Image
            src={src}
            alt={name}
            width={size}
            height={size}
            className={`inline-block drop-shadow-sm ${className}`}
            draggable={false}
        />
    );
}
