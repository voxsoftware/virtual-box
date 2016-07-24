var Vbox=core.org.voxsoftware.VirtualBox
class AdaptorList extends Array{
	
	constructor(machine){
		super()
		this.machine= this.machine
	}

	push(adaptor){
		if(!(adaptor instanceof Vbox.Adaptor))
			adaptor= new Vbox.Adaptor(adaptor, this)
		adaptor.parent= this
		adaptor.index= this.length
		super.push(adaptor)
	}

	/*
	add(adaptor){
		if(!(adaptor instanceof Vbox.Adaptor))
			throw new core.System.ArgumentException("El parámetro debe ser del tipo Adaptor", "adaptor")

		this.push(adaptor)
		adaptor.
	}*/

}

export default AdaptorList