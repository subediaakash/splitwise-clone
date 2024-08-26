export default function Page({ params }: { params: { id: number } }) {
    return <div>My Post: {params.id}</div>;
}