function TestPage() {
  console.log(process.env.DATABASE_URL);

  return (
    <div>
      <h1>This is a test page</h1>
      <p>If you can see this, the page is working!</p>
    </div>
  );
}

export default TestPage;
