const Project = require('../models/Project');
const fs = require('fs').promises;
const path = require('path');

const parseArray = (data) => {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return Array.isArray(data) ? data : [];
};

// Helper to delete image file only if no other project uses it
const deleteImageFile = async (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return;
    
    try {
        // Only attempt to delete if it's a local upload path
        if (!imagePath.startsWith('/uploads/')) return;

        // Check if any other project still uses this image
        const count = await Project.countDocuments({ image: imagePath });
        if (count > 0) {
            console.log(`[Cleanup] Image ${imagePath} is still in use by ${count} projects. Skipping file deletion.`);
            return;
        }

        // Resolve absolute path safely
        // imagePath is like "/uploads/123.jpg"
        const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const absolutePath = path.resolve(__dirname, '..', relativePath);

        try {
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
            console.log(`[Cleanup] Successfully deleted unused image: ${absolutePath}`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`[Cleanup] File not found, skipping: ${absolutePath}`);
            } else {
                console.error(`[Cleanup] Error deleting file ${absolutePath}:`, err.message);
            }
        }
    } catch (err) {
        console.error('[Cleanup] Error in deleteImageFile:', err.message);
    }
};

// @desc    Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 });
        const formattedProjects = projects.map(p => ({
            ...p._doc,
            id: p._id
        }));
        res.json(formattedProjects);
    } catch (error) {
        console.error('GET Projects Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a project
const createProject = async (req, res) => {
    try {
        console.log('Creating product:', req.body.name);
        const { name, description, fullDescription, features, benefits, usage, sizes, category, link, imagePath, visible } = req.body;
        
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        } else if (imagePath) {
            // DUPLICATION LOGIC: Physically copy the image file so there's NO link between products
            try {
                const oldRelativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
                const oldAbsolutePath = path.resolve(__dirname, '..', oldRelativePath);
                
                const ext = path.extname(oldAbsolutePath);
                const newFilename = `${Date.now()}-copy${ext}`;
                const newRelativePath = `uploads/${newFilename}`;
                const newAbsolutePath = path.resolve(__dirname, '..', newRelativePath);
                
                await fs.copyFile(oldAbsolutePath, newAbsolutePath);
                image = `/${newRelativePath}`;
                console.log(`[Duplication] Physically copied image: ${newRelativePath}`);
            } catch (err) {
                console.error('[Duplication] Copy failed, falling back to original path:', err.message);
                image = imagePath; // Fallback to same path if file doesn't exist or copy fails
            }
        }

        const project = new Project({
            name,
            description,
            fullDescription,
            features: parseArray(features),
            benefits: parseArray(benefits),
            usage,
            sizes: parseArray(sizes),
            image,
            category,
            link,
            visible: visible === 'false' ? false : true
        });

        const createdProject = await project.save();
        res.status(201).json({ id: createdProject._id, success: true });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update a project
const updateProject = async (req, res) => {
    try {
        console.log('Updating product ID:', req.params.id);
        const { name, description, fullDescription, features, benefits, usage, sizes, category, link, visible } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const oldImage = project.image;

        // Update fields
        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (fullDescription !== undefined) project.fullDescription = fullDescription;
        if (features !== undefined) project.features = parseArray(features);
        if (benefits !== undefined) project.benefits = parseArray(benefits);
        if (usage !== undefined) project.usage = usage;
        if (sizes !== undefined) project.sizes = parseArray(sizes);
        if (category !== undefined) project.category = category;
        if (link !== undefined) project.link = link;
        if (visible !== undefined) project.visible = visible === 'false' || visible === false ? false : true;

        if (req.file) {
            project.image = `/uploads/${req.file.filename}`;
        }

        const updatedProject = await project.save();
        console.log('Product updated successfully:', updatedProject.name);

        // Cleanup old image if a new one was uploaded
        if (req.file && oldImage && oldImage !== project.image) {
            // We don't await this to avoid blocking the response, but it has its own error handling
            deleteImageFile(oldImage);
        }

        res.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete a project
const deleteProject = async (req, res) => {
    try {
        console.log('Deleting product ID:', req.params.id);
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageToDelete = project.image;
        await Project.findByIdAndDelete(req.params.id);
        console.log('Product deleted from database');
        
        if (imageToDelete) {
            // Cleanup file
            deleteImageFile(imageToDelete);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Reorder projects
const reorderProjects = async (req, res) => {
    try {
        const { ids } = req.body; // Expects ['id1', 'id2', ...]
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: 'IDs must be an array' });
        }

        const updatePromises = ids.map((id, index) => 
            Project.findByIdAndUpdate(id, { sortOrder: index })
        );

        await Promise.all(updatePromises);
        res.json({ success: true });
    } catch (error) {
        console.error('Reorder Projects Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update project status (visibility)
const updateStatus = async (req, res) => {
    try {
        const { visible } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Product not found' });
        
        project.visible = visible === 'false' || visible === false ? false : true;
        await project.save();
        res.json({ success: true, visible: project.visible });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    updateStatus
};
