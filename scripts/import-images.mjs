// Downloads the images from the previous Wix site (see docs/omnigroup-hr-images.md)
// into public/images/, resized and compressed. Re-run with: node scripts/import-images.mjs
//
// Photos and illustrations become WebP, logos stay PNG (transparency kept).
// Heroes fit within 2400x1600, everything else is capped at 1200px wide, and quality is
// stepped down until each file is under 400 KB.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const WIX = "https://static.wixstatic.com/media/";
const OUT = join(import.meta.dirname, "..", "public", "images");
const MAX_BYTES = 400 * 1024;

// [inventory #, output path without extension, Wix file id, kind]
// kind: "hero" (2400px WebP), "photo" (1200px WebP), "logo" (1200px PNG)
const images = [
  [1, "brand/oghr-logo-white", "f254cd_fbaab40ec9eb45dd92f73b8e686cb100~mv2.png", "logo"],
  [2, "brand/oghr-wordmark-white", "f254cd_208857061d3d4064a5c90bb572a5d910~mv2.png", "logo"],
  [3, "home/hero-two-men-meeting", "11062b_bd736b8082284a4ba86927586958efb4~mv2.jpg", "hero"],
  [4, "home/virtual-meeting", "11062b_f874bb66407d445489108554bbe84a1f~mv2.jpeg", "hero"],
  [5, "home/signing-document", "11062b_d3318dd21f604338bda270908a0d9d77~mv2.jpg", "photo"],
  [6, "home/our-philosophy", "f254cd_27110ead0b064cea975074842a184aed~mv2.png", "photo"],
  [7, "home/business-handshake", "4cb2411121d14cab94fb4cfb11f4f056.jpg", "photo"],
  [8, "home/new-opportunity-team", "f254cd_18d9000a18054ae598e5a9f9e5f22fe2~mv2.jpg", "photo"],
  [9, "va/hero-va-banner", "f254cd_34a6a591fff848e19ad6329ea8fcaca6~mv2.png", "hero"],
  [10, "va/flexible-support", "f254cd_84367e631509446688751a4f4b93fce5~mv2.png", "photo"],
  [11, "va/how-it-works", "f254cd_1e63e65d9db54c58b59b98ffe13239b4~mv2.jpg", "photo"],
  [12, "va/streamlined-process", "f254cd_0c4c0841014d40f2836fa38a310a71a8~mv2.png", "photo"],
  [13, "va/why-hire-vas", "f254cd_8c0b27d18d86439dac44b5f6f1f2540a~mv2.png", "photo"],
  [14, "services/hero-typing-laptop", "11062b_0c6ace4e6ec2427e90d6cc5eee47c964~mv2.jpg", "hero"],
  [15, "services/service-card-05", "f254cd_89f8ab2c2ff24d7fa7f9ff6d15e5f663~mv2.png", "photo"],
  [16, "services/service-card-06", "f254cd_fe6dabae7140454e8f74ba725715d6df~mv2.png", "photo"],
  [17, "services/service-card-07", "f254cd_01c6534ec6154075943b20ff2a6e8243~mv2.png", "photo"],
  [18, "services/service-card-08", "f254cd_d5f7d584a26d4e2182dcb87008ecf104~mv2.png", "photo"],
  [19, "services/service-card-09", "f254cd_3e5bfd9fa1314be18e060f5a23ad0eb2~mv2.png", "photo"],
  [20, "services/service-card-10", "f254cd_16883f48eb6f4ab1805539cc80e5a2b2~mv2.png", "photo"],
  [21, "about/hero-glass-facade", "11062b_bb7fb37ba4d844ad8e1bc659b026c09b~mv2.jpg", "hero"],
  [22, "industries/va-services", "f254cd_a09958b0b8a94dcda958de45856caf68~mv2.jpeg", "photo"],
  [23, "industries/engineering", "f254cd_a901b828463446f38ef4c001f15a3d81~mv2.jpeg", "photo"],
  [24, "industries/hr-services", "f254cd_bca4144f79ac4b5695b4a626718e0aa3~mv2.jpeg", "photo"],
  [25, "industries/oil-and-gas", "f254cd_96957add891f4c669b6ef5507ea74c5f~mv2.png", "photo"],
  [26, "industries/finance", "f254cd_0402bd8d992d455bac778f5a7a0c2668~mv2.png", "photo"],
  [27, "industries/infrastructure", "f254cd_f90be177222249b1a0bde724821acbc4~mv2.png", "photo"],
  [28, "about/modern-office-view", "11062b_6ca2b81a96324a81b4be0388bbe57197~mv2.jpg", "photo"],
  [29, "team/tim-armstrong", "f254cd_0ae38839c2fe4dd7ab1888126f16b049~mv2.png", "photo"],
  [30, "team/patricia-depra", "f254cd_5b6fda17b56e49cbaffe0e7080a91de6~mv2.png", "photo"],
  [31, "clients/hero-contract", "f254cd_db966c920f104a03b6c3ce9a2907cbb6~mv2.png", "photo"],
  [32, "clients/logo-city-of-virginia-beach", "f254cd_6b5fe7065642450583857e20706767f6~mv2.jpeg", "logo"],
  [33, "clients/logo-hibiscus", "f254cd_93d734241929402784c2901db35c5820~mv2.png", "logo"],
  [34, "clients/logo-city-of-richmond", "f254cd_2d9bde8f40fb4a2b8d1467366956d1ae~mv2.png", "logo"],
  [35, "clients/logo-shenanigan-h", "f254cd_455f5b073f7547598a13655f0e1c59b2~mv2.png", "logo"],
  [36, "clients/logo-bridge-apparel-co", "f254cd_01a86e4ab2b44faead2363d97b896261~mv2.jpeg", "logo"],
  [37, "clients/logo-options-eatery", "f254cd_46036257c501459192bb0561a367657e~mv2.jpeg", "logo"],
  [38, "clients/logo-black-brand", "f254cd_1db44b9076294306aba46a2ad48e8c82~mv2.jpeg", "logo"],
  [39, "clients/logo-rise", "f254cd_cc65937eb11a4e2f8e5f470e0547c30e~mv2.png", "logo"],
  [40, "careers/hero-customer-service-team", "71fd58dc3e764bc2be4788a0edcda159.jpg", "hero"],
  [41, "careers/woman-using-laptop", "0c52b294084246fb845d9d8c097fd3e4.jpg", "photo"],
  [42, "careers/role-virtual-assistant", "11062b_e61bd16cea75466a8fdb8d592fd1ad7f~mv2.jpg", "photo"],
  [43, "careers/role-contracts-administrator", "11062b_a38017623d9c48bc8f086339a40b2d66~mv2.jpeg", "photo"],
  [44, "careers/role-subcontracts-administrator", "e4cb17_d8e30a161200454183f30bbaccaabd28~mv2.jpeg", "photo"],
  [45, "careers/role-event-setup-crew", "11062b_c9f8db82b5784cd8bd4e644ba5a50db4~mv2.jpg", "photo"],
  [46, "careers/role-maintenance-workers", "a7bedabaadd04eb9b9944f02396ed8ec.jpg", "photo"],
  [47, "careers/apply-hero-office-interior", "61d3218857b34480b88b19656dd7c7be.jpg", "hero"],
];

async function encode(input, kind) {
  const box = kind === "hero" ? { width: 2400, height: 1600, fit: "inside" } : { width: 1200 };
  const resized = sharp(input).rotate().resize({ ...box, withoutEnlargement: true });
  for (let quality = 82; ; quality -= 8) {
    const out =
      kind === "logo"
        ? await resized.clone().png({ compressionLevel: 9, palette: quality < 82, quality }).toBuffer()
        : await resized.clone().webp({ quality, effort: 6 }).toBuffer();
    if (out.length <= MAX_BYTES || quality <= 42) return out;
  }
}

for (const [n, name, id, kind] of images) {
  const res = await fetch(WIX + id);
  if (!res.ok) {
    console.error(`#${n} ${name}: HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  const out = await encode(Buffer.from(await res.arrayBuffer()), kind);
  const file = join(OUT, `${name}.${kind === "logo" ? "png" : "webp"}`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, out);
  const { width, height } = await sharp(out).metadata();
  console.log(`#${n}\t${name}\t${width}x${height}\t${Math.round(out.length / 1024)} KB`);
}
