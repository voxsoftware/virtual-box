var Vbox=core.org.voxsoftware.VirtualBox
class SharedFolderList extends Array{
	
	constructor(machine){
		super()
		this.machine= machine
	}

	push(sharedfolder){
		if(!(sharedfolder instanceof Vbox.SharedFolder))
			sharedfolder= new Vbox.SharedFolder(sharedfolder, this)
		sharedfolder.parent= this
		sharedfolder.index= this.length
		super.push(sharedfolder)
	}


	async add(sharedfolder){
		if(!(sharedfolder instanceof Vbox.SharedFolder))
			throw new core.System.ArgumentException("El parámetro debe ser del tipo SharedFolder", "sharedfolder")

		var args= ["sharedfolder", "add", this.machine.name,
			"--name", sharedfolder.name, "--hostpath", sharedfolder.path]

		if(sharedfolder.isTransient)
			args.push("--transient")
		if(sharedfolder.readonly)
			args.push("--readonly")
		if(sharedfolder.automount)
			args.push("--automount")


		await this.machine.manager.command(args)
		this.push(sharedfolder)
	}

}

export default SharedFolderList