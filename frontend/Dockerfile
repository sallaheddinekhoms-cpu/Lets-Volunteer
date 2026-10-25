FROM node:21

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm --force install

# Copy the app source code
COPY . .

# Accept build arguments for Next.js public env vars
ARG NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Serve the app in production mode
CMD ["npm", "run", "start"]
