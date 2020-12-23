import TryCatchErrorDecorator from "../decorators/TryCatchError.decorator";
import ProjectModel from "../models/project.model";
import ClientError from "../exeptions/client.error";
import PasswordService from "../services/passwort.service";

class ProjectsController {
    @TryCatchErrorDecorator
    static async add(req, res) {
        const isAllreadyProject = await ProjectModel.findOne({projectName: req.body.projectName});

        if (isAllreadyProject) {
            throw new ClientError(res, "Projectname alredy exists", 404);
        }

        const project = new ProjectModel({
            projectName: req.body.projectName,
            description: req.body.description,
            ownerId: req.body.ownerId,
            userIds: req.body.userIds,
            milestones: req.body.milestones
        });

        project.save();
        res.json({
            project: {
                id: project.id,
                ownerId: project.ownerId,
                userIds: project.userIds,
            }
        });
    }

    static async update(req,res){
        res.json({
            project: {
                id: project.id,
                projectName: project.projectName,
                description: project.description,
                ownerId: project.ownerId,
                userIds: project.userIds,
                milestones: project.milestones
            }
        });
    }
}

export default ProjectsController;