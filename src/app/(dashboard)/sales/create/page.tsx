import CreateSaleForm from "~/app/(dashboard)/sales/create/form";
import BackButton from "~/components/back-button";

const CreateSalePage = () => {
  return (
    <div>
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear venta</h1>

        <CreateSaleForm />
      </section>
    </div>
  );
};

export default CreateSalePage;
