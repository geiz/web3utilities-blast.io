import json

# Static values for description and image
description = "The Planet Genesis NFT is the foundational piece of the World of Blast ecosystem, offering an unparalleled opportunity to participate as a stakeholder in the game’s economy. This exclusive collection represents ownership and grants various in-game and revenue-sharing benefits, setting it apart from traditional gaming assets."
image = "https://bafybeiapgmd5gs2tkp46srwcdgznl7kjjowchkixkge6egsca6mcl3k6f4.ipfs.w3s.link/wob-planet-genesis.webp"

# Loop to create files from 0 to 499
for i in range(500):
    metadata = {
        "name": f"Planet Blast #{i}",
        "description": description,
        "image": image
    }

    # Write the metadata to a file with the name as the number (without extension)
    with open(f'{i}', 'w') as f:
        json.dump(metadata, f, indent=2)

print("Metadata files created successfully!")