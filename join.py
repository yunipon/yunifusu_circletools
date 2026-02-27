import os
import sys
import io
from PIL import Image

MAX_SIZE = 2 * 1024 * 1024  # 2MB

def get_exe_dir():
    if getattr(sys, 'frozen', False):
        # exeの場合
        return os.path.dirname(sys.executable)
    else:
        # 通常python実行時
        return os.path.dirname(os.path.abspath(__file__))

def combine_images_vertically(folder_path, output_name="combined.jpg"):
    valid_ext = (".png", ".jpg", ".jpeg", ".webp")

    files = sorted([
        f for f in os.listdir(folder_path)
        if f.lower().endswith(valid_ext)
    ])

    if not files:
        print("画像が見つかりません。")
        return

    images = [Image.open(os.path.join(folder_path, f)).convert("RGB") for f in files]

    widths = [img.width for img in images]
    if len(set(widths)) != 1:
        print("横幅が一致していません。")
        return

    total_height = sum(img.height for img in images)
    width = widths[0]

    combined = Image.new("RGB", (width, total_height))

    y_offset = 0
    for img in images:
        combined.paste(img, (0, y_offset))
        y_offset += img.height

    scale = 1.0

    while scale > 0.3:
        resized = combined.resize(
            (int(width * scale), int(total_height * scale)),
            Image.LANCZOS
        )

        # まずはqualityを調整
        for quality in range(95, 50, -5):
            buffer = io.BytesIO()
            resized.save(buffer, format="JPEG", quality=quality, optimize=True)
            size = buffer.tell()

            print(f"scale={scale:.2f}, quality={quality} → {size/1024/1024:.2f}MB")

            if size <= MAX_SIZE:
                output_path = os.path.join(folder_path, output_name)
                with open(output_path, "wb") as f:
                    f.write(buffer.getvalue())
                print("保存完了（2MB以下）")
                return

        # qualityで無理なら少し縮小
        scale -= 0.05

    print("2MB以下にできませんでした。")

if __name__ == "__main__":
  folder = get_exe_dir()
  combine_images_vertically(folder, os.path.join(folder, "combined.jpg"))