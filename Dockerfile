# Step 1: Use the official Node.js image with Alpine Linux for a small image
FROM node:lts-alpine

# Step 2: Set environment variable for production
ENV NODE_ENV=production

# Step 3: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 4: Copy package.json and other dependency files
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Step 5: Install only production dependencies (use --production flag)
RUN npm install --omit=dev --silent && mv node_modules ../


RUN npm i -g serve

# Step 6: Copy the rest of the application code into the container
COPY . .

# Step 7: Expose port 3000 for Vite development server
EXPOSE 3000

# Step 8: Add the build step to build your Vite app (the build output will be in the `dist` folder)
RUN npm run build


# Step 11: Run the Vite development server (this will start the dev server for frontend development)
CMD ["serve", "-s", "dist"]
